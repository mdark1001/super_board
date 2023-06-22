"""
@author: Miguel Cabrera R. <miguel.cabrera@oohel.net>
@date: 5/26/23
@name: 
"""
import logging
from abc import ABC, abstractmethod


class ChartBase(ABC):
    _logger = logging.getLogger(__name__)
    data = dict()
    _builder = None

    @abstractmethod
    def compute(self):
        raise NotImplemented

    @abstractmethod
    def get_data(self):
        raise NotImplemented
