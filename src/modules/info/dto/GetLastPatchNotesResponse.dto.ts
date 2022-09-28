import { ApiProperty } from '@nestjs/swagger';
import { PatchNote } from '../interfaces/PatchNote';

export class GetLastPatchNotesResponseDto {
  @ApiProperty()
  readonly patchNotes: PatchNote[];

  constructor(patchNotes: PatchNote[]) {
    this.patchNotes = patchNotes;
  }
}
