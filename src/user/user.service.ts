import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { UserAuthDto, UserDto } from './user.dto';
import { Formats } from 'src/utils/formats';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async show(): Promise<UserDto[]> {
    const users = await this.usersRepository.find();

    return users;
  }

  async subscribe(newUser: UserAuthDto): Promise<UserDto> {
    const { username, password } = newUser;

    const userFound = await this.usersRepository.findOneBy({ username });
    if (userFound)
      throw new HttpException(`Already Registered User`, HttpStatus.CONFLICT);

    const userToSave = await Formats.formatUserCreate(username, password);
    const response = await this.usersRepository.save(userToSave);

    return response;
  }

  async login(user: UserAuthDto) {
    const { username, password } = user;

    const userFound = await this.usersRepository.findOneBy({ username });
    if (!userFound)
      throw new HttpException(
        `User '${username}' not found`,
        HttpStatus.NOT_FOUND,
      );

    if (!(await bcrypt.compare(password, userFound.password)))
      throw new HttpException(`Incorrect Credentials`, HttpStatus.UNAUTHORIZED);

    return userFound;
  }
}
