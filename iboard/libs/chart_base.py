"""
@author: Miguel Cabrera R. <miguel.cbarera@oohel.net>
@date: 5/26/23
@name: 
"""
from abc import ABC, abstractmethod


class ChartBase(ABC):

    @abstractmethod
    def compute(self):
        raise NotImplemented

    @abstractmethod
    def get_data(self):
        raise NotImplemented
