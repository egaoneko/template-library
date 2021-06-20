import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@root/app.module';
import { INestApplication } from '@nestjs/common';
import { createTestUser, getTestUserDto } from '../utils/user';
import { cleanDb } from '../utils/db';
import path from 'path';
import fs from 'fs';
import { getModelToken } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { File } from '@shared/file/entities/file.entity';

describe('FileController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await cleanDb(app);
  });

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/file/upload (Post)', async () => {
    const user = await createTestUser(app);
    const dto = await getTestUserDto(app, user);
    return request(app.getHttpServer())
      .post('/api/file/upload')
      .set('Authorization', `Bearer ${dto.token}`)
      .attach('file', path.join(__dirname, './data/sample.png'))
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
      });
  });

  it('/api/file/upload (Post) with empty file', async () => {
    const user = await createTestUser(app);
    const dto = await getTestUserDto(app, user);
    return request(app.getHttpServer())
      .post('/api/file/upload')
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.message).toBe('Not found file');
      });
  });

  it('/api/file/:fileId (Get)', async () => {
    const user = await createTestUser(app);
    const dto = await getTestUserDto(app, user);

    const file = await request(app.getHttpServer())
      .post('/api/file/upload')
      .set('Authorization', `Bearer ${dto.token}`)
      .attach('file', path.join(__dirname, './data/sample.png'));

    return request(app.getHttpServer())
      .get(`/api/file/${file.body.id}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        fs.writeFileSync('./test.jpg', body, 'binary');
        const file = fs.readFileSync(path.join(__dirname, './data/sample.png')) as Buffer;
        expect(body).toEqual(file);
      });
  });

  it('/api/file/:fileId (Get) with empty file', async () => {
    const user = await createTestUser(app);
    const dto = await getTestUserDto(app, user);

    return request(app.getHttpServer())
      .get(`/api/file/1`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.message).toBe('Not found file');
      });
  });

  it('/api/file/:fileId (Get) with fail to find file', async () => {
    const user = await createTestUser(app);
    const dto = await getTestUserDto(app, user);

    const file = await request(app.getHttpServer())
      .post('/api/file/upload')
      .set('Authorization', `Bearer ${dto.token}`)
      .attach('file', path.join(__dirname, './data/sample.png'));

    const fileModel = app.get<typeof File>(getModelToken(File, DEFAULT_DATABASE_NAME));
    const uploadedFile = await fileModel.findOne({ where: { id: file.body.id } });

    if (!uploadedFile) {
      throw 'Can not uploaded';
    }

    fs.rmSync(uploadedFile.path);

    return request(app.getHttpServer())
      .get(`/api/file/${file.body.id}`)
      .set('Authorization', `Bearer ${dto.token}`)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.message).toBe('Fail to find file');
      });
  });
});
