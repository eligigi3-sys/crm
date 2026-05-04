import { handleAuth } from './src/auth.js';
import { handleShopping } from './src/shopping.js';
import { handleLeads, handleDashboard } from './src/leads.js';
import { handleGoogle, handleGoogleCallback } from './src/google-calendar.js';
import { handleContacts } from './src/contacts.js';
import { serveHTML } from './src/ui.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    if (path === '/auth/google/callback') {
      return handleGoogleCallback(request, env);
    }

    if (path === '/' || path === '/index.html') {
      return new Response(serveHTML(), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }

    if (path.startsWith('/api/')) {
      try {
        let response;

        if (path.startsWith('/api/auth')) {
          response = await handleAuth(request, env, path);
        } else if (path.startsWith('/api/dashboard')) {
          response = await handleDashboard(request, env, path);
        } else if (path.startsWith('/api/leads')) {
          response = await handleLeads(request, env, path);
        } else if (path.startsWith('/api/google')) {
          response = await handleGoogle(request, env, path);
        } else if (path.startsWith('/api/contacts')) {
          response = await handleContacts(request, env, path);
        } else if (
          path.startsWith('/api/shopping-lists') ||
          path.startsWith('/api/shopping-items') ||
          path.startsWith('/api/shopping-purchases')
        ) {
          response = await handleShopping(request, env, path);
        } else {
          response = { error: 'Route not found' };
        }

        return new Response(JSON.stringify(response), {
          headers: { ...cors, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...cors, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};