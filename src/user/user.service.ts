import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { Token, UserAuthDto, UserDto } from './user.dto';
import { Formats } from 'src/utils/formats';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async show(): Promise<UserDto[]> {
    const users = await this.usersRepository.find();

    return users;
  }

  async subscribe(newUser: UserAuthDto): Promise<Token> {
    const { username, password } = newUser;

    const userFound = await this.usersRepository.findOneBy({ username });
    if (userFound)
      throw new HttpException(`Already Registered User`, HttpStatus.CONFLICT);

    const userToSave = await Formats.formatUserCreate(username, password);
    await this.usersRepository.save(userToSave);

    const payload = { sub: userToSave.id, username: userToSave.username };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async login(user: UserAuthDto): Promise<Token> {
    const { username, password } = user;

    const userFound = await this.usersRepository.findOneBy({ username });
    if (!userFound)
      throw new HttpException(
        `User '${username}' not found`,
        HttpStatus.NOT_FOUND,
      );

    if (!(await bcrypt.compare(password, userFound.password)))
      throw new HttpException(`Incorrect Credentials`, HttpStatus.UNAUTHORIZED);

    const payload = { sub: userFound.id, username: userFound.username };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
