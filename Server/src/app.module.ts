import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exception-filters/exception.filter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from './configs/mail.config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TaskRatingModule } from './task-rating/task-rating.module';
import { validationSchema } from './validators/env-validator';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'Client/build'),
      exclude: ['/api*', '/static*'],
    }),

    ServeStaticModule.forRoot({
      serveRoot: '/static',
      rootPath: join(__dirname, '../..', 'static'),
      exclude: ['/api*'],
    }),

    RouterModule.register([
      {
        path: '/api',
        module: AppModule,
        children: [
          {
            path: '/',
            module: UsersModule,
          },
          {
            path: '/',
            module: TasksModule,
          },
          {
            path: '/',
            module: TaskRatingModule,
          },
        ],
      },
    ]),

    AuthModule,
    UsersModule,
    PrismaModule,
    TasksModule,
    TaskRatingModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}
