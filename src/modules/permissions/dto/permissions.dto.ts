import { Type } from 'class-transformer';
import {
    ArrayUnique,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Action } from '../../roles/enums/action.enum';
import { Resource } from '../../roles/enums/resource.enum';

export class Permission {
  @IsEnum(Resource)
  resource: Resource;

  @IsEnum(Action, { each: true })
  @ArrayUnique()
  actions: Action[];
}
