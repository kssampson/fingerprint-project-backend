import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Name } from './name.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Name)
    private namesRepository: Repository<Name>,
  ) {}
  async addUserDetails(name: string, email: string) {
    //take the name and save it into the name table of the database
    const result = await this.namesRepository.save({name, email})
    console.log('inside addUserDetails save: ', result)
    return await this.getUserDetails();
  }
  async getUserDetails() {
    //get all names from the database
    return await this.namesRepository.find();
  }
}
