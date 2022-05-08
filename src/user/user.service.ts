import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from '@app/user/types/userResponce.interface';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username already registered',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async login(user: LoginUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne(
      {
        email: user.email,
      },
      { select: ['id', 'email', 'username', 'bio', 'image', 'password'] },
    );
    if (!userByEmail) {
      throw new HttpException(
        'Email or password wrong',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const match = await compare(user.password, userByEmail.password);

    if (!match || !userByEmail) {
      throw new HttpException(
        'Email or password wrong',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete userByEmail.password;

    return userByEmail;
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<UserEntity> {
    const currentUser = await this.userRepository.findOne(id);
    Object.assign(currentUser, updateUser);
    return await this.userRepository.save(currentUser);
  }

  generateJWT(user: UserEntity): string {
    const { id, username, email } = user;
    return sign({ id, email, username }, JWT_SECRET);
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }
}
