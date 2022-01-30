import { RouteParamsDecl } from '../types';
import { signatureTemplate, staticDeclarations, staticDeclImports } from './output.templates';

export function createRuntimePluginFile(routesDeclTemplate: string): string {
  return `
  import { defineNuxtPlugin } from '#app';

  export default defineNuxtPlugin((nuxtApp) => {
    const routesList = ${routesDeclTemplate};

    return {
      provide: {
        typedRouter: nuxtApp.vueApp.$router,
        routesList,
      },
    };
  });
  `;
}

export function createRuntimeHookFile(routesDeclTemplate: string): string {
  return `
  import { getCurrentInstance } from 'vue';

  function useNuxtApp() {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error('nuxt instance unavailable');
    }
    return vm.appContext.app.$nuxt;
  }

  export const useTypedRouter = () => {
    const { $router } = useNuxtApp();

    const routesList = ${routesDeclTemplate};

    return {
      router: $router,
      routes: routesList,
    };
  };

  `;
}

export function createRuntimeRoutesFile({
  routesList,
  routesObjectTemplate,
  routesObjectName,
}: {
  routesList: string[];
  routesObjectName: string;
  routesObjectTemplate: string;
}): string {
  return `
    ${signatureTemplate}

    export const ${routesObjectName} = ${routesObjectTemplate};

    ${createTypedRouteListExport(routesList)}
  `;
}

export function createDeclarationRoutesFile({
  routesDeclTemplate,
  routesList,
  routesParams,
}: {
  routesDeclTemplate: string;
  routesList: string[];
  routesParams: RouteParamsDecl[];
}): string {
  return `
    ${signatureTemplate}
    ${staticDeclImports}

    export type RouteListDecl = ${routesDeclTemplate};

    ${createTypedRouteParamsExport(routesParams)}

    ${staticDeclarations}
  `;
}

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
            .map(({ key, required, type }) => `"${key}"${required ? '' : '?'}: ${type}`)
            .join(',\n')}
        }`
              : 'never'
          }`
      )
      .join(',\n')}
  }`;
}