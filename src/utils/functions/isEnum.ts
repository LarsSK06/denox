const isEnum = <T extends Parameters<typeof Object.values>[0]>(value: any, enumType: T): value is T =>
    Object.values(enumType).includes(value);

export default isEnum;