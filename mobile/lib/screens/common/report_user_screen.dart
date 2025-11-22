import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/report.dart';
import '../../providers/report_provider.dart';
import '../../widgets/custom_button.dart';

class ReportUserScreen extends StatefulWidget {
  final int reportedUserId;
  final int? requestId;

  const ReportUserScreen({
    Key? key,
    required this.reportedUserId,
    this.requestId,
  }) : super(key: key);

  @override
  State<ReportUserScreen> createState() => _ReportUserScreenState();
}

class _ReportUserScreenState extends State<ReportUserScreen> {
  final _formKey = GlobalKey<FormState>();
  String _selectedReason = 'spam';
  final _descriptionController = TextEditingController();
  bool _isSubmitting = false;

  final List<Map<String, String>> _reasons = [
    {'value': 'spam', 'label': 'Spam'},
    {'value': 'inappropriate', 'label': 'Contenido inapropiado'},
    {'value': 'fraud', 'label': 'Fraude'},
    {'value': 'harassment', 'label': 'Acoso'},
    {'value': 'other', 'label': 'Otro'},
  ];

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submitReport() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
    });

    final reportProvider = Provider.of<ReportProvider>(context, listen: false);

    final request = CreateReportRequest(
      reportedId: widget.reportedUserId,
      requestId: widget.requestId,
      reason: _selectedReason,
      description: _descriptionController.text,
    );

    await reportProvider.createReport(request);

    setState(() {
      _isSubmitting = false;
    });

    if (reportProvider.error == null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Reporte enviado exitosamente')),
        );
        Navigator.pop(context);
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(reportProvider.error!),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reportar Usuario'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Icon(Icons.report, size: 64, color: Colors.orange),
            const SizedBox(height: 16),
            const Text(
              'Reportar comportamiento inapropiado',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Tu reporte será revisado por nuestro equipo. Gracias por ayudarnos a mantener una comunidad segura.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),

            // Reason Dropdown
            DropdownButtonFormField<String>(
              value: _selectedReason,
              decoration: const InputDecoration(
                labelText: 'Motivo del reporte',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.label),
              ),
              items: _reasons.map((reason) {
                return DropdownMenuItem(
                  value: reason['value'],
                  child: Text(reason['label']!),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedReason = value!;
                });
              },
            ),
            const SizedBox(height: 16),

            // Description
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Descripción',
                hintText: 'Describe el problema con detalle...',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.description),
              ),
              maxLines: 5,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Por favor describe el problema';
                }
                if (value.trim().length < 10) {
                  return 'La descripción debe tener al menos 10 caracteres';
                }
                return null;
              },
            ),
            const SizedBox(height: 32),

            CustomButton(
              text: 'Enviar Reporte',
              onPressed: _isSubmitting ? null : _submitReport,
              isLoading: _isSubmitting,
            ),
          ],
        ),
      ),
    );
  }
}
