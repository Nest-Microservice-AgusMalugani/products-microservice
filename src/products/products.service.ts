import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
private readonly logger = new Logger("ProductsService")

  onModuleInit() {
    this.$connect();
    this.logger.log("Database connected")
    
  }
  create(createProductDto: CreateProductDto) {

    return this.product.create({
      data: createProductDto
    })
  }

  async findAll(pagination: PaginationDto) {

const { page, limit } = pagination;

const totalPage = await this.product.count();


const products = await this.product.findMany({
  skip: (page - 1) * limit,
  take: limit,
})


    return {
      data: products,
      meta: {
        totalProducts: totalPage,
        page,
        totalPages: Math.ceil(totalPage / limit),
      } 
    };
  }

  async findOne(id: number) {

    const product = await this.product.findUnique({
      where: {id}
    })
    if(!product) {
      throw new Error(`Product with id ${id} not found`)
    }
    return product;
}

  update(id: number, updateProductDto: UpdateProductDto) {
    const{id: _,...data} = updateProductDto

    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
