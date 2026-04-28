import { removeVietnameseDiacritics, generateVietnameseSearchPatterns } from '../../../src/utils/vietnamese';

describe('Vietnamese Utilities', () => {
  describe('removeVietnameseDiacritics', () => {
    it('should remove diacritics from lowercase text', () => {
      expect(removeVietnameseDiacritics('hội kỹ thuật')).toBe('hoi ky thuat');
      expect(removeVietnameseDiacritics('trần văn a')).toBe('tran van a');
    });

    it('should remove diacritics from uppercase text', () => {
      expect(removeVietnameseDiacritics('NGUYỄN VĂN B')).toBe('NGUYEN VAN B');
      expect(removeVietnameseDiacritics('ĐẠI HỌC')).toBe('DAI HOC');
    });

    it('should handle special character đ/Đ', () => {
      expect(removeVietnameseDiacritics('đi đâu đó')).toBe('di dau do');
      expect(removeVietnameseDiacritics('ĐI ĐÂU ĐÓ')).toBe('DI DAU DO');
    });

    it('should return empty string if input is empty', () => {
      expect(removeVietnameseDiacritics('')).toBe('');
    });

    it('should not change text without diacritics', () => {
      expect(removeVietnameseDiacritics('hello world')).toBe('hello world');
    });
  });

  describe('generateVietnameseSearchPatterns', () => {
    it('should return original and normalized text', () => {
      const search = 'Nguyễn';
      const patterns = generateVietnameseSearchPatterns(search);
      expect(patterns).toContain('Nguyễn');
      expect(patterns).toContain('nguyen');
    });
  });
});
