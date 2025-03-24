import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^[0-9]*$/, "Phone number must contain only digits")
    .required("Phone number is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const createUserValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]*$/, "Phone number must contain only digits")
    .required("Phone number is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup.string(),
  invested: yup
    .number()
    .required("Invested amount is required")
    .min(1, "Invested amount must be at least 1"),
  returnAmount: yup
    .number()
    .required("Return amount is required")
    .min(0, "Return amount must be at least 0"),
  investedDate: yup
    .date()
    .required("Invested date is required")
    .test(
      "is-valid-day",
      "Invested date must be between 1 and 28 ",
      (value) => {
        if (!value) return false;
        const day = value.getDate();
        return day >= 1 && day <= 28;
      }
    ),
});

export const adminAddTransactionValidationSchema = yup.object().shape({
  type: yup.string().oneOf(["CREDIT", "DEBIT"]).required("Type is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .min(1, "Amount must be at least 1"),
  label: yup
    .string()
    .oneOf(["INVESTMENT", "WITHDRAWAL", "SERVICE", "OTHERS"])
    .required("Label is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters"),
});

export const updateUserValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]*$/, "Phone number must contain only digits")
    .required("Phone number is required"),
  invested: yup
    .number()
    .required("Invested amount is required")
    .min(0, "Invested amount must be at least 0"),
  returnAmount: yup
    .number()
    .required("Return amount is required")
    .min(0, "Return amount must be at least 0"),
  investedDate: yup.date().required("Invested date is required"),
});
