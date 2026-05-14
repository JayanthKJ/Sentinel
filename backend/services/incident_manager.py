import uuid
from typing import List, Dict
from datetime import datetime, timedelta
from models.event import Event
from models.incident import Incident

class IncidentManager:
    """
    The intelligence layer - groups related events into meaningful incidents.
    This is where the magic happens: turning noise into insights.
    """
    
    # Define incident detection rules
    # When multiple events from same system occur within time window, group them
    INCIDENT_RULES = {
        "cooling_system": {
            "title": "Cooling System Failure",
            "cause": "Multiple cooling-related failures detected, likely systemic issue",
            "recommendation": "Check cooling infrastructure immediately. Verify fan operation and coolant levels.",
            "time_window": 300  # 5 minutes
        },
        "power_grid": {
            "title": "Power System Instability",
            "cause": "Electrical system showing signs of failure or overload",
            "recommendation": "Switch to backup power. Inspect main power supply and surge protection.",
            "time_window": 300
        },
        "pressure_system": {
            "title": "Pressure Control Failure",
            "cause": "Pressure regulation system compromised",
            "recommendation": "Emergency pressure relief procedures required. Check all valves and sensors.",
            "time_window": 300
        },
        "network": {
            "title": "Network Connectivity Issues",
            "cause": "Communication failures affecting monitoring capability",
            "recommendation": "Verify network infrastructure. Check sensor connectivity.",
            "time_window": 600  # 10 minutes
        }
    }
    
    def __init__(self):
        self.incidents: List[Incident] = []
        self.event_to_incident_map: Dict[str, str] = {}  # event_id -> incident_id
    
    def detect_incidents(self, events: List[Event]) -> List[Incident]:
        """
        Analyze events and create incidents when patterns are detected.
        Main intelligence function.
        """
        # Group events by system
        system_groups = self._group_events_by_system(events)
        
        # For each system, check if we should create an incident
        for system, system_events in system_groups.items():
            if system not in self.INCIDENT_RULES:
                continue
            
            # Check if we have multiple events close together in time
            clustered_events = self._find_time_clusters(
                system_events,
                self.INCIDENT_RULES[system]["time_window"]
            )
            
            for cluster in clustered_events:
                if len(cluster) >= 2:  # At least 2 related events = incident
                    self._create_incident(system, cluster)
        
        return self.incidents
    
    def _group_events_by_system(self, events: List[Event]) -> Dict[str, List[Event]]:
        """Group events by their system"""
        grouped = {}
        for event in events:
            if event.system not in grouped:
                grouped[event.system] = []
            grouped[event.system].append(event)
        return grouped
    
    def _find_time_clusters(self, events: List[Event], time_window: int) -> List[List[Event]]:
        """
        Find clusters of events that occurred within a time window.
        Returns groups of related events.
        """
        if not events:
            return []
        
        # Sort events by timestamp
        sorted_events = sorted(events, key=lambda e: datetime.fromisoformat(e.timestamp))
        
        clusters = []
        current_cluster = [sorted_events[0]]
        
        for event in sorted_events[1:]:
            # Check if event is within time window of cluster start
            cluster_start = datetime.fromisoformat(current_cluster[0].timestamp)
            event_time = datetime.fromisoformat(event.timestamp)
            
            if (event_time - cluster_start).total_seconds() <= time_window:
                current_cluster.append(event)
            else:
                # Start new cluster
                if len(current_cluster) >= 2:
                    clusters.append(current_cluster)
                current_cluster = [event]
        
        # Don't forget the last cluster
        if len(current_cluster) >= 2:
            clusters.append(current_cluster)
        
        return clusters
    
    def _create_incident(self, system: str, events: List[Event]) -> Incident:
        """Create an incident from a cluster of related events"""
        # Check if these events are already part of an incident
        existing_incident_id = None
        for event in events:
            if event.event_id in self.event_to_incident_map:
                existing_incident_id = self.event_to_incident_map[event.event_id]
                break
        
        if existing_incident_id:
            # Add events to existing incident
            incident = next((i for i in self.incidents if i.incident_id == existing_incident_id), None)
            if incident:
                for event in events:
                    incident.add_event(event.event_id)
                    self.event_to_incident_map[event.event_id] = incident.incident_id
                return incident
        
        # Create new incident
        rule = self.INCIDENT_RULES[system]
        
        # Determine priority based on highest severity in cluster
        priority = self._calculate_priority(events)
        
        incident = Incident(
            incident_id=str(uuid.uuid4())[:8],
            incident_title=f"{rule['title']} - {priority.upper()}",
            priority=priority,
            related_events=[e.event_id for e in events],
            possible_cause=rule["cause"],
            recommendation=rule["recommendation"],
            status="open"
        )
        
        self.incidents.append(incident)
        
        # Map events to this incident
        for event in events:
            self.event_to_incident_map[event.event_id] = incident.incident_id
        
        return incident
    
    def _calculate_priority(self, events: List[Event]) -> str:
        """
        Calculate incident priority based on event severities.
        Takes the highest severity from the event cluster.
        """
        severity_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        
        max_severity = "low"
        max_value = 0
        
        for event in events:
            value = severity_order.get(event.severity, 0)
            if value > max_value:
                max_value = value
                max_severity = event.severity
        
        return max_severity
    
    def get_all_incidents(self) -> List[Incident]:
        """Return all incidents"""
        return self.incidents
    
    def get_open_incidents(self) -> List[Incident]:
        """Get only open incidents"""
        return [i for i in self.incidents if i.status == "open"]
    
    def get_incident_by_id(self, incident_id: str) -> Incident:
        """Get specific incident by ID"""
        return next((i for i in self.incidents if i.incident_id == incident_id), None)
    
    def clear_incidents(self):
        """Clear all incidents"""
        self.incidents = []
        self.event_to_incident_map = {}