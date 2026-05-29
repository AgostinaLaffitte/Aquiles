// src/banners/banners.controller.ts
import { 
  Controller, Post, Body, Get, Delete, Param, ParseIntPipe, 
  UseInterceptors, UploadedFiles 
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('banners')
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  // Usamos FilesInterceptor limitado a 1 archivo para mantener la simetría con productos
  @UseInterceptors(FilesInterceptor('files', 1, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `banner-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const baseUrl = this.configService.getOrThrow<string>('BASE_URL');
    
    if (files && files.length > 0) {
      // Guardamos la URL absoluta idéntica a cómo lo hacés en productos
      createBannerDto.imageUrl = `${baseUrl}/uploads/${files[0].filename}`;
    }

    return this.bannersService.create(createBannerDto);
  }

  @Get()
  findAll() {
    return this.bannersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.remove(id);
  }
}