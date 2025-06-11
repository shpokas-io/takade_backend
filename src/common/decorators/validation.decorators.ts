import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          // At least 8 characters
          if (value.length < 8) return false;
          
          // At least one lowercase letter
          if (!/[a-z]/.test(value)) return false;
          
          // At least one uppercase letter
          if (!/[A-Z]/.test(value)) return false;
          
          // At least one digit
          if (!/\d/.test(value)) return false;
          
          // At least one special character
          if (!/[@$!%*?&]/.test(value)) return false;
          
          // No common weak patterns
          const weakPatterns = [
            /123456/,
            /password/i,
            /qwerty/i,
            /admin/i,
            /letmein/i,
          ];
          
          for (const pattern of weakPatterns) {
            if (pattern.test(value)) return false;
          }
          
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, one special character (@$!%*?&), and must not contain common weak patterns';
        },
      },
    });
  };
}

export function IsValidSlug(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidSlug',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen';
        },
      },
    });
  };
} 