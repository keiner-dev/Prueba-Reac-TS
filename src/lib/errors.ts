
export type ApiErrorKind =
  | "network"
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "notFound"
  | "conflict"
  | "unknown";


export class ApiError extends Error {
 
  public readonly kind: ApiErrorKind;

  public readonly status?: number;

  public readonly details?: unknown;

  constructor(kind: ApiErrorKind, message: string, status?: number, details?: unknown) {
    super(message);

    this.name = "ApiError";

    this.kind = kind;
  
    this.status = status;

    this.details = details;
  }


  static fromStatus(status: number, message: string, details?: unknown): ApiError {
    const kind: ApiErrorKind =
      status === 400 || status === 422 // 400 = petición inválida, 422 = validación
        ? "validation" // los tratamos como error de validación
        : status === 401 // 401 = no autenticado (token inválido/expirado)
          ? "unauthorized" // categoría de no autorizado
          : status === 403 // 403 = autenticado pero sin permisos
            ? "forbidden" // categoría de prohibido
            : status === 404 // 404 = recurso no encontrado
              ? "notFound" // categoría de no encontrado
              : status === 409 // 409 = conflicto de estado
                ? "conflict" // categoría de conflicto
                : "unknown"; // cualquier otro status cae en desconocido


    return new ApiError(kind, message, status, details);
  }
}


export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  const message = error instanceof Error ? error.message : "Error inesperado";
  return new ApiError("unknown", message);
}
