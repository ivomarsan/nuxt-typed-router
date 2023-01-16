import { RouteParamsDecl } from '../../../types';

export function createTypedRouteListExport(routesList: string[]): string {
  return `export type TypedRouteList = ${routesList.map((m) => `'${m}'`).join('|\n')}`;
}

export function createTypedRouteParamsExport(routesParams: RouteParamsDecl[]): string {
  return `export type TypedRouteParams = {
    ${routesParams
      .map(
        ({ name, params }) =>
          `"${name}": ${
            params.length
              ? `{
          ${params
            .map(({ key, required }) => `"${key}"${required ? '' : '?'}: string | number`)
            .join(',\n')}
        }`
              : 'never'
          }`
      )
      .join(',\n')}
  }`;
}

export function createTypedRouteNamedMapperExport(routesParams: RouteParamsDecl[]): string {
  return `export type TypedRouteNamedMapper = 
    ${routesParams
      .map(
        ({ name, params }) =>
          `{name: "${name}" ${
            params.length
              ? `, params${params.some((s) => s.required) ? '' : '?'}: {
          ${params
            .map(({ key, required }) => `"${key}"${required ? '' : '?'}: string | number`)
            .join(',\n')}
        }`
              : ''
          }}`
      )
      .join('|\n')}
  `;
}

export function createResolvedTypedRouteNamedMapperExport(routesParams: RouteParamsDecl[]): string {
  return `export type ResolvedTypedRouteNamedMapper = 
  {
    name: TypedRouteList;
    params: unknown;
  } & (
    ${routesParams
      .map(
        ({ name, params }) =>
          `{name: "${name}" ${
            params.length
              ? `, params: {
                ${params
                  .map(
                    ({ key, notRequiredOnPage }) =>
                      `"${key}"${notRequiredOnPage ? '?' : ''}: string`
                  )
                  .join(',\n')}
        }`
              : ''
          }}`
      )
      .join('|\n')}
      )
  `;
}