import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { IsNull, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { user_id, reply_to, ...ticketDTO } = createTicketDto;

    const user = await this.userService.findOne(user_id);

    let replyToTicket: Ticket | undefined;

    if (reply_to) {
      const targetTicket = await this.ticketRepository.findOne({
        where: { id: reply_to },
        relations: {
          reply_to: true,
        },
      });

      if (!targetTicket) {
        throw new BadRequestException('تیکت مورد نظر برای ریپلای پیدا نشد.');
      }

      // اگر تیکتی که می‌خواهیم به آن ریپلای کنیم
      // خودش ریپلای یک تیکت دیگر باشد، اجازه نده
      if (targetTicket.reply_to) {
        throw new BadRequestException(
          'شما نمی‌توانید به یک ریپلای، مجدداً ریپلای کنید.',
        );
      }

      replyToTicket = targetTicket;
    }

    const ticket = this.ticketRepository.create({
      ...ticketDTO,
      user,
      reply_to: replyToTicket,
    });

    return this.ticketRepository.save(ticket);
  }

  async findAll() {
    return await this.ticketRepository.find({
      where: { reply_to: IsNull() },
      relations: { reply_to: true },
    });
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOneOrFail({
      where: { id },
      relations: { replies: true, reply_to: true },
    });

    return ticket;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
