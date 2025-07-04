import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { ProductModule } from "./products/product.module";
import { OrderModule } from "./orders/order.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products/product.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ReviewModule } from "./reviews/review.module";
import { Review } from "./reviews/review.entity";
import { User } from "./users/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { UploadModule } from "./upload/upload.module";
import { MailModule } from "./mail/mail.module";

@Module({
  imports: [
    UploadModule,
    UserModule,
    ProductModule,
    OrderModule,
    ReviewModule,
    MailModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "postgres",
          database: config.get<string>("DB_DATABASE"),
          username: config.get<string>("DB_USERNAME"),
          password: config.get<string>("DB_PASSWORD"),
          port: config.get<number>("DB_PORT"),
          host: "localhost",
          synchronize: process.env.NODE_ENV !== "producation" ? true : false, //only in dev(no need for migration ) in porducation will delete data
          entities: [Product, Review, User],
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>("JWT_SECRET"),
          signOptions: { expiresIn: config.get<string>("JWT_EXPIRE_IN") },
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
