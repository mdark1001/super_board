"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 5/26/23
@name: 
"""
import logging
from abc import ABC, abstractmethod


class ChartBase(ABC):
    _logger = logging.getLogger(__name__).info
    _builder = None
    field_name: str = None

    @abstractmethod
    def compute(self):
        raise NotImplemented

    @abstractmethod
    def get_data(self):
        raise NotImplemented

    def set_field_name(self):
        self.field_name = self._builder.model_field_group_by_1.name
        return self
