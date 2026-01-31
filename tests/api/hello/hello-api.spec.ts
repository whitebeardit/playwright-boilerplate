import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/api/hello/inputs.json';

test.describe('API Hello - JSONPlaceholder', () => {
  test('deve retornar post quando GET por id', async ({ request }) => {
    // Arrange
    const { postId } = inputs.getPost;

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
    const newPost = inputs.createPost;

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

