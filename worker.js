import { handleAuth } from './src/auth.js';
import { handleShopping } from './src/shopping.js';
import { handleLeads, handleDashboard } from './src/leads.js';
import { handleGoogle, handleGoogleCallback } from './src/google-calendar.js';
import { handleContacts } from './src/contacts.js';
import { handleEmployees } from './src/employees.js';
import { handleProducts } from './src/products.js';
import { handleAdmin } from './src/admin.js';
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

    if (path === '/' || path === '/index.html' || path === '/admin' || path === '/crm') {
      return new Response(serveHTML(), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }

    if (path.startsWith('/api/')) {
      try {
        let response;

        if (path.startsWith('/api/auth')) {
          response = await handleAuth(request, env, path);
        } else if (path.startsWith('/api/admin')) {
          response = await handleAdmin(request, env, path);
        } else if (path.startsWith('/api/dashboard')) {
          response = await handleDashboard(request, env, path);
        } else if (path.startsWith('/api/leads') || path.startsWith('/api/lead-employees')) {
          response = await handleLeads(request, env, path);
        } else if (path.startsWith('/api/google')) {
          response = await handleGoogle(request, env, path);
        } else if (path.startsWith('/api/contacts')) {
          response = await handleContacts(request, env, path);
        } else if (path.startsWith('/api/employees')) {
          response = await handleEmployees(request, env, path);
        } else if (path.startsWith('/api/products') || path.startsWith('/api/product-purchases') || path.startsWith('/api/inventory')) {
          response = await handleProducts(request, env, path);
        } else if (
          path.startsWith('/api/shopping-lists') ||
          path.startsWith('/api/shopping-items') ||
          path.startsWith('/api/shopping-purchases')
        ) {
          response = await handleShopping(request, env, path);
        } else {
          response = { error: 'Route not found' };
        }

        if (response instanceof Response) {
          const headers = new Headers(response.headers);
          Object.entries(cors).forEach(([key, value]) => headers.set(key, value));
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          });
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