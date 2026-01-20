export default {
  async fetch(request, env, ctx) {
    return new Response('Hello, World!', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
