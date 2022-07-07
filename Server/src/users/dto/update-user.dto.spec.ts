import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('update-user.dto', () => {
  let dto: UpdateUserDto;
  beforeAll(() => {
    dto = {
      name: '',
    };
  });

  it('Имя пустое', async () => {
    const ofImportDto = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(ofImportDto);
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy();
  });

  it('Имя не пустое', async () => {
    dto.name = 'name';
    const ofImportDto = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(ofImportDto);
    expect(errors.map((err) => err.property).includes('name')).toBeFalsy();
  });
});
