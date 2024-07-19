import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async addUserDetails(name: string, email: string) {
    //take the name and save it into the name table of the database
    const result = await this.usersRepository.save({name, email})
    console.log('inside addUserDetails save: ', result)
    return await this.getUserDetails();
  }
  async getUserDetails() {
    //get all names from the database
    return await this.usersRepository.find();
  }
}
