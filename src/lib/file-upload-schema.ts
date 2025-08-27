import { z } from "zod";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Nome do arquivo é obrigatório!" }),
  contentType: z
    .string()
    .min(1, { message: "Tipo de conteúdo é obrigatório!" }),
  size: z.number().min(1, { message: "O tamanho é obrigatório!" }),
  isImage: z.boolean(),
  isVideo: z.boolean(),
  isDocument: z.boolean(),
  fileType: z.enum(["image", "video", "document"]),
  fileExtension: z
    .string()
    .min(1, { message: "Extensão do arquivo é obrigatória!" }),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  courseId: z.string().optional(),
  tempUpload: z.boolean().optional(),
});
