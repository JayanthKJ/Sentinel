from flask import Blueprint, jsonify, request
from services.simulator import EventSimulator
from services.event_processor import EventProcessor
from services.incident_manager import IncidentManager

# Create Blueprint for API routes
api_bp = Blueprint('api', __name__)

# Initialize services (in-memory for MVP)
simulator = EventSimulator()
processor = EventProcessor()
incident_manager = IncidentManager()

@api_bp.route('/events', methods=['GET'])
def get_events():
    """
    GET /api/events
    Returns all events. Optionally filter by severity or system.
    Query params:
    - severity: filter by severity level
    - system: filter by system name
    - status: filter by status (active/resolved)
    """
    try:
        events = processor.get_all_events()
        
        # Apply filters if provided
        severity = request.args.get('severity')
        system = request.args.get('system')
        status = request.args.get('status')
        
        if severity:
            events = [e for e in events if e.severity == severity]
        
        if system:
            events = [e for e in events if e.system == system]
        
        if status:
            events = [e for e in events if e.status == status]
        
        return jsonify({
            "success": True,
            "count": len(events),
            "events": [e.to_dict() for e in events]
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route('/incidents', methods=['GET'])
def get_incidents():
    """
    GET /api/incidents
    Returns all incidents with their related events.
    Query params:
    - priority: filter by priority level
    - status: filter by status (open/investigating/resolved)
    """
    try:
        incidents = incident_manager.get_all_incidents()
        
        # Apply filters if provided
        priority = request.args.get('priority')
        status = request.args.get('status')
        
        if priority:
            incidents = [i for i in incidents if i.priority == priority]
        
        if status:
            incidents = [i for i in incidents if i.status == status]
        
        return jsonify({
            "success": True,
            "count": len(incidents),
            "incidents": [i.to_dict() for i in incidents]
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route('/simulate', methods=['POST'])
def simulate_events():
    """
    POST /api/simulate
    Generate new mock events and process them.
    Body (optional):
    {
        "count": 10,
        "system": "cooling_system"  // optional: target specific system
    }
    """
    try:
        data = request.get_json() or {}
        count = data.get('count', 10)
        system = data.get('system')
        
        # Generate events
        if system:
            events = simulator.generate_related_events(system, count)
        else:
            events = simulator.generate_batch(count)
        
        # Process events
        processed_events = processor.process_batch(events)
        
        # Detect incidents
        incidents = incident_manager.detect_incidents(processed_events)
        
        return jsonify({
            "success": True,
            "message": f"Generated {len(events)} events and detected {len(incidents)} incidents",
            "events_generated": len(events),
            "incidents_detected": len(incidents),
            "new_incidents": [i.to_dict() for i in incidents]
        }), 201
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """
    GET /api/dashboard
    Returns summary statistics for dashboard display.
    """
    try:
        all_events = processor.get_all_events()
        active_events = processor.get_active_events()
        all_incidents = incident_manager.get_all_incidents()
        open_incidents = incident_manager.get_open_incidents()
        
        # Count by severity
        severity_counts = {
            "critical": len([e for e in active_events if e.severity == "critical"]),
            "high": len([e for e in active_events if e.severity == "high"]),
            "medium": len([e for e in active_events if e.severity == "medium"]),
            "low": len([e for e in active_events if e.severity == "low"])
        }
        
        # Count by system
        system_counts = {}
        for event in active_events:
            system_counts[event.system] = system_counts.get(event.system, 0) + 1
        
        return jsonify({
            "success": True,
            "summary": {
                "total_events": len(all_events),
                "active_events": len(active_events),
                "total_incidents": len(all_incidents),
                "open_incidents": len(open_incidents),
                "severity_breakdown": severity_counts,
                "system_breakdown": system_counts
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route('/reset', methods=['POST'])
def reset_data():
    """
    POST /api/reset
    Clear all events and incidents. Useful for testing.
    """
    try:
        simulator.clear_events()
        processor.clear_events()
        incident_manager.clear_incidents()
        
        return jsonify({
            "success": True,
            "message": "All data cleared"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500