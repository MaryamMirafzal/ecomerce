import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const { user_id, ...AddressData } = createAddressDto;
    const user = await this.userRepository.findOneByOrFail({ id: user_id });
    const address = this.addressRepository.create({
      ...AddressData,
      user,
    });

    return this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return await this.addressRepository.find({ relations: { user: true } });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!address) throw new NotFoundException(` آدرس با آیدی ${id} یافت نشد!`);

    return address;
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(id);
    Object.assign(address, updateAddressDto);
    return await this.addressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
    return `آدرس با آیدی ${id} حذف شد.`;
  }
}
