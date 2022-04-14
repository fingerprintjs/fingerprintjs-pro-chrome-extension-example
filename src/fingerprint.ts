import fp from '@fingerprintjs/fingerprintjs-pro';

export async function testFingerprintJs(context: string) {
  const apiKey = process.env.API_KEY;

  if(!apiKey) {
    throw new Error('API_KEY is not defined');
  }

  try {
    const agent = await fp.load({
      apiKey,
    });

    const result = await agent.get({
      extendedResult: true,
    });

    console.log({
      result,
      env: context,
    });
  } catch (error) {
    console.error({
      error,
      env: context,
    });
  }
}
