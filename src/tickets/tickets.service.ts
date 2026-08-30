import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService,
  ) {}
  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { user_id, reply_to, ...TicketDTO } = createTicketDto;
    const user = await this.userService.findOne(user_id);
    const replyToTicket = await this.ticketRepository.findOneByOrFail({
      id: reply_to,
    });
    const ticket = this.ticketRepository.create({
      ...TicketDTO,
      user,
      reply_to: replyToTicket,
    });

    return this.ticketRepository.save(ticket);
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
