import { api } from './api';
import { buildReferencesAndText, sortBibleReferences, findBibleReferences } from './services/bibleReferences';

jest.mock('./services/bibleReferences');

describe('api', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call findBibleReferences, sortBibleReferences, and buildReferencesAndText with correct arguments', async () => {
    const mockText = 'mockText';
    const mockTranslation = 'nvi';
    const mockReferences = ['mockReference1', 'mockReference2'];
    const mockSortedReferences = ['mockReference2', 'mockReference1'];
    const mockResult = 'mockResult';

    (findBibleReferences as jest.Mock).mockReturnValue(mockReferences);
    (sortBibleReferences as jest.Mock).mockReturnValue(mockSortedReferences);
    (buildReferencesAndText as jest.Mock).mockResolvedValue(mockResult);

    const result = await api(mockText, mockTranslation);

    expect(findBibleReferences).toHaveBeenCalledWith(mockText);
    expect(sortBibleReferences).toHaveBeenCalledWith(mockReferences);
    expect(buildReferencesAndText).toHaveBeenCalledWith(mockSortedReferences, mockTranslation);
    expect(result).toBe(mockResult);
  });
});
