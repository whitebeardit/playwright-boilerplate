import { test, expect } from '@playwright/test';

test.describe('API Hello - JSONPlaceholder', () => {
  test('deve retornar post quando GET por id', async ({ request }) => {
    // Arrange
    const postId = 1;

    // Act
    const response = await request.get(`/posts/${postId}`);

    // Assert
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('id', postId);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
  });

  test('deve criar recurso quando POST com dados válidos', async ({ request }) => {
    // Arrange
    const newPost = {
      title: 'Título do post',
      body: 'Corpo do post',
      userId: 1,
    };

    // Act
    const response = await request.post('/posts', {
      data: newPost,
    });

    // Assert
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({
      title: newPost.title,
      body: newPost.body,
      userId: newPost.userId,
    });
    expect(body).toHaveProperty('id');
  });
});

