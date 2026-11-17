import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const base = 'https://openradio.io/api/v1';
const models = ['eleven_v4', 'eleven_multilingual_v2', 'eleven_turbo_v2_5'];

async function api(path, body) {
  const key = process.env.OPENRADIO_API_KEY?.trim();
  if (!key?.startsWith('orv_')) {
    throw new Error('Configura OPENRADIO_API_KEY con la nueva clave de OpenRadio.');
  }
  const response = await fetch(base + path, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      ...(body && { 'Content-Type': 'application/json' }),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'error',
    signal: AbortSignal.timeout(body ? 120_000 : 30_000),
  });
  if (!response.ok) throw new Error(`OpenRadio respondió HTTP ${response.status} en ${path.split('?')[0]}.`);
  return response.json();
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'account' || command === 'models') {
    console.log(JSON.stringify(await api(command === 'account' ? '/me' : '/models'), null, 2));
    return;
  }

  if (command === 'voices') {
    const query = new URLSearchParams({
      provider: 'elevenlabs',
      language: 'es',
      gender: 'male',
      page_size: '100',
    });
    if (args.length) query.set('search', args.join(' '));
    console.log(JSON.stringify(await api(`/voices?${query}`), null, 2));
    return;
  }

  const [voiceId, script, output, model = 'eleven_v4'] = args;
  if (command !== 'generate' || !voiceId || !script || !output?.endsWith('.mp3') || !models.includes(model)) {
    throw new Error('Uso: node openradio.mjs account|models|voices [búsqueda] | generate <voice_id> <guion.txt> <salida.mp3> [modelo]');
  }
  const text = (await readFile(script, 'utf8')).replace(/^\uFEFF/, '').trim();
  if (!text) throw new Error('El guion está vacío.');
  if (await stat(output, { throwIfNoEntry: false }).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  })) throw new Error('El archivo de salida ya existe.');

  const result = await api('/tts', {
    text,
    voice_id: voiceId,
    model_id: model,
    async: false,
  });
  if (typeof result?.audio_url !== 'string' || !result.audio_url.startsWith('https://')) {
    throw new Error('OpenRadio no devolvió un audio_url HTTPS. Revisa el panel antes de repetir la generación.');
  }
  const audio = await fetch(result.audio_url, { signal: AbortSignal.timeout(60_000) });
  if (!audio.ok) throw new Error(`La descarga del audio falló con HTTP ${audio.status}.`);
  const contentType = audio.headers.get('content-type')?.split(';')[0];
  if (!['audio/mpeg', 'audio/mp3', 'application/octet-stream'].includes(contentType)) {
    throw new Error('La descarga no tiene un tipo de contenido compatible con MP3.');
  }
  const bytes = Buffer.from(await audio.arrayBuffer());
  const hasId3 = bytes.subarray(0, 3).toString() === 'ID3';
  const hasFrameSync = bytes.length > 2 && bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
  if (bytes.length < 4 || !(hasId3 || hasFrameSync)) throw new Error('La descarga no contiene un encabezado MP3.');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, bytes, { flag: 'wx' });
  console.log(`Narración guardada en ${output}`);
}

main().catch((error) => {
  if (error.code === 'EEXIST') {
    console.error('El archivo de salida ya existe.');
  } else if (error.name === 'TimeoutError' || error instanceof TypeError) {
    console.error('Falló la conexión o se agotó el tiempo. Revisa el panel antes de repetir una generación.');
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
});
