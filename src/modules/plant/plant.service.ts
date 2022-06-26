import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlantRequestDto } from './dto/CreatePlantRequest.dto';

@Injectable()
export class PlantService {
  constructor(private prisma: PrismaService) {}

  createPlant(createPlantRequestDto: CreatePlantRequestDto) {
    console.log(createPlantRequestDto)
  }
  
}
