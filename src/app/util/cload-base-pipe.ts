import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cloudBase' })
export class CloudBasePipe implements PipeTransform {
    transform(cloudBaseFtAgl1: number): string {
        let cloadBase: string = "" + cloudBaseFtAgl1 / 100;
        while (cloadBase.length < 3) cloadBase = "0" + cloadBase;
        return cloadBase;
    }
}