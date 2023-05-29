"""
@author: Miguel Cabrera R. <miguel.cbarera@oohel.net>
@date: 5/16/23
@name: 
"""
from odoo.addons.iboard.libs.response import make_response, STATES


def validate_record(model, key):
    def record(func):
        """
        The validate_servicio function is a decorator that checks if the servicio_id parameter exists in the request.
        If it does not exist, then an error message is returned to the user. If it does exist, then we check if there
        is a record with that id in our database. If there isn't one, we return an error message to the user as well.

        :param func: Pass the function that will be decorated
        :return: A function that returns a function
        :doc-author: Trelent
        """

        def wrapper(self, *args, **kwargs):
            """
            The wrapper function is used to check if the user has access to a specific service.
                If not, it returns an error message. Otherwise, it calls the original function.

            :param self: Access the class instance
            :param *args: Pass a non-keyworded, variable-length argument list to the function
            :param **kwargs: Pass keyworded, variable-length argument list to the function
            :return: A dictionary with the following keys:
            :doc-author: Trelent
            """
            if not kwargs.get(key):
                return make_response(state=STATES['BAD_REQUEST'], message='No existe el registro seleccionado')
            instance = self.env[model].browse(kwargs.get(key))
            if not instance.exists():
                return make_response(state=STATES['NOT_FOUND'], message='No existe el registro seleccionado')
            kwargs['instance'] = instance
            return func(self, *args, **kwargs)

        return wrapper

    return record
