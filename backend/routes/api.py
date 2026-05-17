from flask import Blueprint, jsonify, request

from services.simulator import EventSimulator
from services.event_processor import EventProcessor
from services.incident_manager import IncidentManager


# Blueprint registration
api_bp = Blueprint("api", __name__)


# Core services
simulator = EventSimulator()
processor = EventProcessor()
incident_manager = IncidentManager()


@api_bp.route("/events", methods=["GET"])
def get_events():
    """
    GET /api/events

    Returns all processed events.

    Optional query params:
    - severity
    - system
    - status
    """

    try:

        events = processor.get_all_events()

        severity = request.args.get("severity")
        system = request.args.get("system")
        status = request.args.get("status")

        if severity:
            events = [
                event for event in events
                if event.severity == severity
            ]

        if system:
            events = [
                event for event in events
                if event.system == system
            ]

        if status:
            events = [
                event for event in events
                if event.status == status
            ]

        return jsonify({
            "success": True,
            "count": len(events),
            "events": [
                event.to_dict()
                for event in events
            ]
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route("/incidents", methods=["GET"])
def get_incidents():
    """
    GET /api/incidents

    Returns all detected incidents.

    Optional query params:
    - priority
    - status
    """

    try:

        incidents = incident_manager.get_all_incidents()

        priority = request.args.get("priority")
        status = request.args.get("status")

        if priority:
            incidents = [
                incident for incident in incidents
                if incident.priority == priority
            ]

        if status:
            incidents = [
                incident for incident in incidents
                if incident.status == status
            ]

        return jsonify({
            "success": True,
            "count": len(incidents),
            "incidents": [
                incident.to_dict()
                for incident in incidents
            ]
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route("/simulate", methods=["POST"])
def simulate_events():
    """
    POST /api/simulate

    Generates realistic industrial event chains
    and processes them into incidents.

    Body:
    {
        "count": 2,
        "system": "cooling_system"
    }
    """

    try:

        data = request.get_json() or {}

        # Represents logical simulation cycles
        count = data.get("count", 1)

        system = data.get("system")

        # Generate simulation data
        if system:

            events = simulator.generate_related_events(
                system,
                count
            )

        else:

            events = simulator.generate_simulation_batch(
                count
            )

        # Track dashboard metrics
        incident_manager.log_processed_events(
            len(events)
        )

        # Process event intelligence
        processed_events = processor.process_batch(
            events
        )

        # Detect incidents
        incidents = incident_manager.detect_incidents(
            processed_events
        )

        return jsonify({

            "success": True,

            "message":
                (
                    f"Generated {len(events)} events "
                    f"and detected {len(incidents)} "
                    f"new/updated incidents"
                ),

            "events_generated":
                len(events),

            "incidents_detected":
                len(incidents),

            "new_incidents":
                [
                    incident.to_dict()
                    for incident in incidents
                ]

        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """
    GET /api/dashboard

    Returns intelligent dashboard metrics
    and operational summaries.
    """

    try:

        base_metrics = incident_manager.get_dashboard_metrics()

        all_events = processor.get_all_events()

        active_events = processor.get_active_events()

        all_incidents = incident_manager.get_all_incidents()

        open_incidents = incident_manager.get_open_incidents()

        # Severity distribution
        severity_counts = {

            "critical":
                len([
                    event for event in active_events
                    if event.severity == "critical"
                ]),

            "high":
                len([
                    event for event in active_events
                    if event.severity == "high"
                ]),

            "medium":
                len([
                    event for event in active_events
                    if event.severity == "medium"
                ]),

            "low":
                len([
                    event for event in active_events
                    if event.severity == "low"
                ])
        }

        # System distribution
        system_counts = {}

        for event in active_events:

            system_counts[event.system] = (
                system_counts.get(event.system, 0) + 1
            )

        response_payload = {

            "success": True,

            "summary": {

                **base_metrics,

                "total_events":
                    len(all_events),

                "active_events":
                    len(active_events),

                "total_incidents":
                    len(all_incidents),

                "open_incidents":
                    len(open_incidents),

                "severity_breakdown":
                    severity_counts,

                "system_breakdown":
                    system_counts
            }
        }

        # Flat metrics for frontend compatibility
        response_payload.update(base_metrics)

        return jsonify(response_payload), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@api_bp.route("/reset", methods=["POST"])
def reset_data():
    """
    POST /api/reset

    Clears all generated events
    and incident history.
    """

    try:

        simulator.clear_events()

        processor.clear_events()

        incident_manager.clear_incidents()

        return jsonify({
            "success": True,
            "message": "All monitoring data cleared"
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500