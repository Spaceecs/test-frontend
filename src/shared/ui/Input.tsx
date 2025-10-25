import { Field, ErrorMessage } from 'formik'

export const Input = ({ name, type = 'text', placeholder }: any) => (
    <div>
        <Field
            name={name}
            type={type}
            placeholder={placeholder}
            className="border w-full p-2 rounded"
        />
        <ErrorMessage
            name={name}
            component="div"
            className="text-red-500 text-sm mt-1"
        />
    </div>
)
