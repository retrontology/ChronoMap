from dataclasses import dataclass
from datetime import date

@dataclass
class Frame:
    """A frame in the ChronoMap database."""
    id: str
    region: str
    date: date
    title: str
    description: str
    url: str
    path: str


    def to_dict(self) -> dict[str, str]:
        """
        Convert the Frame object to a dictionary.
        
        Returns:
            dict[str, str]: A dictionary representation of the Frame object.
        """
        return {
            "id": self.id,
            "region": self.region,
            "date": self.date.strftime("%B %d, %Y"),
            "title": self.title,
            "description": self.description,
            "url": self.url,
            "path": self.path,
        }
