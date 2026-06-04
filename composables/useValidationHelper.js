export function useValidationHelper() {

    const maxSize = 1000;
    const passwordLength = 6;
    const imageTypes = ['image/jpeg', 'image/png'];
    const numberReg = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
    const reg = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

    const imageFile = (file) => {
        if (!imageTypes.includes(file['type']) || file['size'] / 1000 > maxSize) {
            return false
        }
        return true
    };

    const isValidEmail = (email) => {
        return reg.test(email)
    };

    const isValidNumber = (number) => {
        return numberReg.test(number)
    };
    const isValidLength = (password) => {
        return password.length >= passwordLength
    };

    return {
        imageFile, isValidEmail, isValidNumber, isValidLength
    }
}


