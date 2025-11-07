import { cva, type VariantProps } from 'class-variance-authority'

export { default as Input } from './Input.vue'

export const inputVariants = cva(
    'w-full h-11 px-4 bg-transparent border border-solid rounded-md border-white focus:border-[#cb8a2e] !focus:border-[#cb8a2e] text-white text-base placeholder:text-white transition-all duration-200 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                default: 'border-[#151515] focus:border-black !focus:border-black text-base text-[#181818]',
                dark: 'border-white focus:border-[#cb8a2e] !focus:border-[#cb8a2e] text-white text-base placeholder:text-white',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export type InputVariants = VariantProps<typeof inputVariants>