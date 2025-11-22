import 'package:flutter/material.dart';
import '../models/report.dart';
import '../services/api_service.dart';

class ReportProvider with ChangeNotifier {
  final ApiService _apiService;

  ReportProvider(this _apiService);

  List<Report> _myReports = [];
  bool _isLoading = false;
  String? _error;

  List<Report> get myReports => _myReports;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> createReport(CreateReportRequest request) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _apiService.createReport(request);
      _error = null;
      // Refresh the list after creating a new report
      await loadMyReports();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadMyReports() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _myReports = await _apiService.getMyReports();
      _error = null;
    } catch (e) {
      _error = e.toString();
      _myReports = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
