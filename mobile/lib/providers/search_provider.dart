import 'package:flutter/material.dart';
import '../models/service_request.dart';
import '../models/search_params.dart';
import '../services/api_service.dart';

class SearchProvider with ChangeNotifier {
  final ApiService _apiService;

  SearchProvider(this._apiService);

  List<ServiceRequest> _searchResults = [];
  bool _isLoading = false;
  String? _error;
  SearchParams _currentParams = SearchParams();

  List<ServiceRequest> get searchResults => _searchResults;
  bool get isLoading => _isLoading;
  String? get error => _error;
  SearchParams get currentParams => _currentParams;

  Future<void> search(SearchParams params) async {
    _isLoading = true;
    _error = null;
    _currentParams = params;
    notifyListeners();

    try {
      _searchResults = await _apiService.searchRequests(params.toJson());
      _error = null;
    } catch (e) {
      _error = e.toString();
      _searchResults = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearResults() {
    _searchResults = [];
    _error = null;
    _currentParams = SearchParams();
    notifyListeners();
  }

  void updateParams(SearchParams params) {
    _currentParams = params;
    notifyListeners();
  }
}
