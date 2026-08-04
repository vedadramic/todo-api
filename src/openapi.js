const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Task API',
    version: '1.0.0',
    description: 'A simple CRUD API for managing to-do tasks.',
  },
  servers: [
    { url: 'http://localhost:3000' }
  ],
  tags: [
    { name: 'Meta', description: 'Server info and health' },
    { name: 'Tasks', description: 'Create, read, update and delete tasks' },
  ],
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id:    { type: 'integer', example: 1 },
          title: { type: 'string',  example: 'Buy groceries' },
          done:  { type: 'boolean', example: false },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Task 99 not found' },
        },
      },
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['Meta'],
        summary: 'API info',
        responses: { 200: { description: 'API description object' } },
      },
    },
    '/health': {
      get: {
        tags: ['Meta'],
        summary: 'Health check',
        responses: { 200: { description: 'Server is alive' } },
      },
    },
    '/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List all tasks',
        responses: {
          200: {
            description: 'Array of all tasks',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a new task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Buy milk' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Task created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          400: { description: 'Invalid input', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        summary: 'Get one task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Task found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          404: { description: 'Task not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Tasks'],
        summary: 'Update a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Updated title' },
                  done:  { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Task updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          400: { description: 'Invalid input' },
          404: { description: 'Task not found' },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Task deleted' },
          404: { description: 'Task not found' },
        },
      },
    },
  },
};

module.exports = swaggerDefinition;