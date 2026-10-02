import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-items.entity';
import { UsersService } from 'src/users/users.service';
import { AddressService } from 'src/address/address.service';
import { ProductsService } from 'src/products/products.service';
import OrderStatusEnum from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly userService: UsersService,
    private readonly addressService: AddressService,
    private readonly productService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userService.findOne(createOrderDto.user_id);

    const address = await this.addressService.findOne(
      createOrderDto.address_id,
    );

    const order = this.orderRepository.create({
      user,
      address,
      total_price: createOrderDto.total_price,

      // discount_code در Entity از نوع string است
      discount_code:
        createOrderDto.discount_code !== undefined
          ? String(createOrderDto.discount_code)
          : undefined,

      status: createOrderDto.status || OrderStatusEnum.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    if (createOrderDto.items?.length) {
      const orderItems = await Promise.all(
        createOrderDto.items.map(async (item) => {
          const product = await this.productService.findOne(item.productId);

          const orderItem = this.orderItemRepository.create({
            order: savedOrder,
            product,
          });

          return this.orderItemRepository.save(orderItem);
        }),
      );

      // اگر relation در Entity با نام items تعریف شده باشد
      savedOrder.items = orderItems;
    }

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: {
        user: true,
        address: true,
        items: true,
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        address: true,
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (updateOrderDto.user_id !== undefined) {
      order.user = await this.userService.findOne(updateOrderDto.user_id);
    }

    if (updateOrderDto.address_id !== undefined) {
      order.address = await this.addressService.findOne(
        updateOrderDto.address_id,
      );
    }

    if (updateOrderDto.total_price !== undefined) {
      order.total_price = updateOrderDto.total_price;
    }

    if (updateOrderDto.discount_code !== undefined) {
      order.discount_code = String(updateOrderDto.discount_code);
    }

    if (updateOrderDto.status !== undefined) {
      order.status = updateOrderDto.status;
    }

    const updatedOrder = await this.orderRepository.save(order);

    if (updateOrderDto.items !== undefined) {
      await this.orderItemRepository.delete({
        order: {
          id,
        },
      });

      if (updateOrderDto.items.length > 0) {
        const orderItems = await Promise.all(
          updateOrderDto.items.map(async (item) => {
            const product = await this.productService.findOne(item.productId);

            const orderItem = this.orderItemRepository.create({
              order: updatedOrder,
              product,
            });

            return this.orderItemRepository.save(orderItem);
          }),
        );

        updatedOrder.items = orderItems;
      } else {
        updatedOrder.items = [];
      }
    }

    return updatedOrder;
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);

    await this.orderItemRepository.delete({
      order: {
        id: order.id,
      },
    });

    await this.orderRepository.remove(order);
  }
}
