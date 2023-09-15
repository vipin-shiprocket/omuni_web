import { Pipe, PipeTransform } from '@angular/core';

type Mapper<T, G> = (item: T, ...args: unknown[]) => G;

/**
 * Maps object to an arbitrary result through a mapper function
 *
 * @param value an item to transform
 * @param mapper a mapping function
 * @param args arbitrary number of additional arguments
 *
 * https://medium.com/@huannx.dev/build-mapper-pipe-angular-1b56089325b6
 */
@Pipe({
  name: 'mapper',
  standalone: true,
})
export class MapperPipe implements PipeTransform {
  transform<T, G>(value: T, mapper: Mapper<T, G>, ...args: unknown[]): G {
    return mapper(value, ...args);
  }
}
