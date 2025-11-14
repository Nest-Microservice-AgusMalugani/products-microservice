import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
private readonly logger = new Logger("ProductsService")

  onModuleInit() {
    this.$connect();
    this.logger.log("Database connected")
    
  }
  async create(createProductDto: CreateProductDto) {
    try{
    const product = await this.product.create({
      data: createProductDto
    }) 
    return product;
    }catch(e){
      throw new RpcException({
        status:400,
        message: e.message
      })
    }
  
  }

  async findAll(pagination: PaginationDto) {
try{
let { page, limit } = pagination;

if(!page || !limit) {
  page = 1;
  limit = 10;
}

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
  }catch(e){
      throw new RpcException({
        status:400,
        message: e.message
      })
    }
  }

  async findOne(id: number) {
try{
    const product = await this.product.findUnique({
      where: {id}
    })

    if(!product) {
      throw new RpcException({
        status:HttpStatus.BAD_REQUEST,
        message:`Product with id ${id} not found`
      })
    }
    return product;
}catch(e){
      throw new RpcException({
        status:400,
        message: e.message
      })
    }

  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const{id: _,...data} = updateProductDto

    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }


async validateProducts(productsId: number[]){
  
  try{
const ids= Array.from(new Set(productsId));

const products = await this.product.findMany({
  where:{
    id:{
      in: ids
    }
  }
})

if(ids.length !== products.length){
  throw new RpcException({
    status: HttpStatus.BAD_REQUEST,
    message:"No se encontraron productos"
   })
}

return products
}catch(e){
      throw new RpcException({
        status:400,
        message: e.message
      })
    }

}

}
