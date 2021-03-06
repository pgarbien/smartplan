import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

import configuration from "../config/configuration";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AuthModule} from "./auth/auth.module";
import {LocationsModule} from "./locations/locations.module";
import {DeviceModule} from "./device/device.module";
import {FileModule} from "./file/file.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const options = new DocumentBuilder()
        .setTitle('SmartPlan backend API')
        .setDescription('')
        .setVersion('1.0.0')
        .addServer('https://smartplan.supla.io/api')
        .addServer('https://atomowki.azurewebsites.net/api')
        .addServer('http://localhost:4000')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        include: [AuthModule, LocationsModule, DeviceModule, FileModule]
    });
    SwaggerModule.setup('api_docs', app, document);

    await app.listen(configuration().port);
}


bootstrap();
